import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { join } from 'path';
import { ALLOWED_MIMES } from 'src/util/constants';
import { MessagesHelper } from '../helpers/messages.helper';
import { diskStorage, StorageEngine } from 'multer';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

interface StorageTypes {
  local: StorageEngine;
}

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}

  getStorageTypeConfig(): StorageTypes {
    return {
      local: diskStorage({
        destination(req, file, callback) {
          callback(null, join(process.cwd(), 'tmp', 'uploads'));
        },
        filename(req, file, callback) {
          randomBytes(16, (err, hash) => {
            if (err) callback(err, null);

            file.filename = `${hash.toString('hex')}-${file.originalname}`;
            callback(null, file.filename);
          });
        },
      }),
    };
  }

  createMulterOptions(): MulterModuleOptions {
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    const storageType = this.configService.get('STORAGE_TYPE') ?? '';
    return {
      storage: this.getStorageTypeConfig()[storageType],
      dest: join(process.cwd(), 'tmp', 'uploads'),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, callback) => {
        console.log(file.mimetype);

        if (ALLOWED_MIMES.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(MessagesHelper.INVALID_FILE_TYPE),
            null,
          );
        }
      },
    };
  }
}

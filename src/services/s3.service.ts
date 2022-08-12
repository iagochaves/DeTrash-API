import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client as S3AWSClient,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { IS3CreateResponseData, IS3Service } from 'src/http/dto/s3.dto';

@Injectable()
export class S3Service implements IS3Service {
  private s3Client: S3AWSClient;
  private readonly tokenLifetime = 3600; // 60 minutes

  constructor(private configService: ConfigService) {
    this.s3Client = new S3AWSClient({
      region: this.configService.get('AWS_DEFAULT_REGION') ?? '',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') ?? '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') ?? '',
      },
    });
  }

  async getPreSignedObjectUrl(fileName: string): Promise<string> {
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.configService.get('BUCKET_NAME') ?? '',
      Key: fileName,
    });

    const authorizedUrlGetObject = await getSignedUrl(
      this.s3Client,
      getObjectCommand,
      {
        expiresIn: this.tokenLifetime,
      },
    );

    return authorizedUrlGetObject;
  }

  async createPreSignedObjectUrl(
    fileName: string,
    residueType: string,
  ): Promise<IS3CreateResponseData> {
    const hash = randomBytes(16);

    const hashedFileName = `${hash.toString('hex')}-${residueType}-${fileName}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: this.configService.get('BUCKET_NAME') ?? '',
      Key: hashedFileName,
    });

    const authorizedUrlPutObject = await getSignedUrl(
      this.s3Client,
      putObjectCommand,
      { expiresIn: this.tokenLifetime },
    );

    return {
      createUrl: authorizedUrlPutObject,
      fileName: hashedFileName,
    };
  }
}

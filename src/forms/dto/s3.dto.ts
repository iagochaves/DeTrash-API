export interface IS3Service {
  getPreSignedObjectUrl(fileName: string): Promise<string>;
  createPreSignedObjectUrl(fileName: string): Promise<IS3CreateResponseData>;
}

export interface IS3CreateResponseData {
  createUrl: string;
  name: string;
}

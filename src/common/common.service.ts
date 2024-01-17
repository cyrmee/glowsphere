import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class CommonService {
  async fileExistsAsync(filePath: string): Promise<boolean> {
    try {
      await fs.promises.stat(filePath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  async deleteFileAsync(filePath: string): Promise<boolean> {
    try {
      await fs.promises.unlink(filePath);
      console.log(`File deleted successfully: ${filePath}`);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(`File not found: ${filePath}`);
      } else {
        console.error(`Error deleting file: ${error.message}`);
      }
      throw new Error('Failed to delete the file');
    }
  }
}

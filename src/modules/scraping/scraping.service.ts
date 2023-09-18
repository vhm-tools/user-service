import { Injectable } from '@nestjs/common';

@Injectable()
export class ScrapingService {
  async cloneWebsite(url: string): Promise<string> {
    return Promise.resolve(url);
  }
}

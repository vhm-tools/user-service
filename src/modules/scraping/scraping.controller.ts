import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
@ApiTags('Scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Get()
  cloneWebsite(@Query('url') url: string) {
    return this.scrapingService.cloneWebsite(url);
  }
}

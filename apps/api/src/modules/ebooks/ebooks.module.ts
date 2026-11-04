import { Module } from '@nestjs/common';
import { EbooksController } from './ebooks.controller';
import { EbooksService } from './ebooks.service';
import { EbookPlannerService } from './services/ebook-planner.service';
import { EbookWriterService } from './services/ebook-writer.service';
import { EbookPdfService } from './services/ebook-pdf.service';
import { EbookQueueService } from './services/ebook-queue.service';
import { EbookReviewService } from './services/ebook-review.service';
import { EbookCoverService } from './services/ebook-cover.service';
import { EbookEpubService } from './services/ebook-epub.service';
import { EbookDocxService } from './services/ebook-docx.service';

@Module({
  controllers: [EbooksController],
  providers: [
    EbooksService,
    EbookPlannerService,
    EbookWriterService,
    EbookPdfService,
    EbookQueueService,
    EbookReviewService,
    EbookCoverService,
    EbookEpubService,
    EbookDocxService,
  ],
  exports: [EbooksService],
})
export class EbooksModule {}

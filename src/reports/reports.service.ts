import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report-dto';
import { Reports } from './reports.entity';
import { User } from 'src/users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Reports) private repo: Repository<Reports>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto)
    report.user = user

    return this.repo.save(report)
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } })
    if(!report) {
      throw new NotFoundException('Record not Found')
    }

    report.approved = approved
    return this.repo.save(report)
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    return this.repo.createQueryBuilder()
      .select('*')
      .where('make = :make', {make: estimateDto.make})
      .andWhere('model = :model', {model: estimateDto.model})
      .getRawMany()
  }
}

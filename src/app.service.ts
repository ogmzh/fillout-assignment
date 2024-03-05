import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';

import { FilterClauseType, FormResponse } from './utils/types';
import { QueryParams } from './utils/query-params';

@Injectable()
export class AppService {
  private readonly API_URL = 'https://api.fillout.com';
  private readonly FORM_ID = 'cLZojxk94ous';
  private readonly REQUEST_CONFIG: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  };

  constructor(private readonly httpService: HttpService) {}

  async getFilteredFormResponses(
    queryParams?: QueryParams,
    filters?: FilterClauseType[],
  ): Promise<FormResponse> {
    const responseData: FormResponse = await lastValueFrom(
      this.httpService
        .get(`${this.API_URL}/v1/api/forms/${this.FORM_ID}/submissions`, {
          // we don't want to pass limit and offset to the API if we got custom filters passed,
          // since we want to limit and offset our result after applying our additional filters
          params: {
            ...queryParams,
            limit: filters && filters.length > 0 ? 150 : queryParams.limit,
            offset: filters && filters.length > 0 ? 0 : queryParams.offset,
          },
          ...this.REQUEST_CONFIG,
        })
        .pipe(map((response) => response.data)),
    );
    if (filters && filters.length > 0) {
      const submissions = responseData.responses.filter((response) =>
        filters.every((filter) => {
          const question = response.questions.find((q) => q.id === filter.id);
          if (!question) return false;

          switch (filter.condition) {
            case 'equals':
              return question.value === filter.value;
            case 'does_not_equal':
              return question.value !== filter.value;
            case 'greater_than':
              if (question.type === 'DatePicker') {
                return new Date(question.value) > new Date(filter.value);
              } else {
                return question.value > filter.value;
              }
            case 'less_than':
              if (question.type === 'DatePicker') {
                return new Date(question.value) < new Date(filter.value);
              } else {
                return question.value < filter.value;
              }
            default:
              return false;
          }
        }),
      );
      const offset = queryParams.offset ? Number(queryParams.offset) : 0;
      const limit = queryParams.limit ? Number(queryParams.limit) : 150;
      return {
        responses: submissions.slice(offset, offset + limit),
        totalResponses: submissions.length,
        pageCount: Math.ceil(submissions.length / (queryParams.limit ?? 150)),
      };
    } else {
      return responseData;
    }
  }
}

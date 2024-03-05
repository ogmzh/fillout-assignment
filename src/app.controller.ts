import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { FormResponse } from './utils/types';
import { QueryParamsWithFilters } from './utils/query-params';
import { ParseFiltersPipe } from './utils/parse-filters-pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:formId/filteredResponses')
  async getStuff(
    @Param('formId') formId: string, // THIS IS ACTUALLY UNUSED SINCE WE HARDCODE THE FORM_ID IN THE SERVICE
    @Query(new ParseFiltersPipe()) queryParams: QueryParamsWithFilters,
  ): Promise<FormResponse> {
    const noFiltersQueryParams = { ...queryParams };
    delete noFiltersQueryParams.filters;

    const result = await this.appService.getFilteredFormResponses(
      noFiltersQueryParams,
      queryParams.filters,
    );

    return result;
  }
}

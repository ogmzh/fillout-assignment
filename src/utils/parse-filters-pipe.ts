import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { FilterClauseCondition, FilterClauseType } from './types';
import { QueryParamsWithFilters } from './query-params';

@Injectable()
export class ParseFiltersPipe
  implements PipeTransform<any, QueryParamsWithFilters>
{
  transform(value: any): QueryParamsWithFilters {
    if (value.filters) {
      try {
        value.filters = JSON.parse(value.filters);
      } catch (error) {
        throw new BadRequestException(
          'Invalid filters parameter. Must be a valid JSON array.',
        );
      }
      this.validateFilters(value.filters);
    }
    return value;
  }

  private validateFilters(filters: FilterClauseType[]): void {
    const validConditions: FilterClauseCondition[] = [
      'equals',
      'does_not_equal',
      'greater_than',
      'less_than',
    ];
    for (const filter of filters) {
      if (!validConditions.includes(filter.condition)) {
        throw new BadRequestException(
          `Invalid condition '${filter.condition}' for filter '${filter.id}'.`,
        );
      }
    }
  }
}

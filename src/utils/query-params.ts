import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { FilterClauseType } from './types';

export class QueryParams {
  @IsInt()
  @Min(1)
  @Max(150)
  @Type(() => Number)
  limit?: number = 150;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sort?: 'asc' | 'desc';

  @IsDateString()
  @IsOptional()
  afterDate?: string;

  @IsDateString()
  @IsOptional()
  beforeDate?: string;

  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  @Type(() => Number)
  offset: number = 0;

  @IsIn(['finished', 'in_progress'])
  status?: 'finished' | 'in_progress' = 'finished';

  @IsBoolean()
  @Type(() => Boolean)
  includeEditLink?: boolean = false;
}

export class QueryParamsWithFilters extends QueryParams {
  filters: FilterClauseType[];
}

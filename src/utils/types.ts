export interface FormResponse {
  responses: Submission[];
  pageCount: number;
  totalResponses: number;
}

export interface Submission {
  submissionId: string;
  submissionTime: string;
  lastUpdatedAt: string;
  questions: Question[];
}

export type QuestionType =
  | 'ShortAnswer'
  | 'LongAnswer'
  | 'DatePicker'
  | 'NumberInput'
  | 'MultipleChoice'
  | 'EmailInput';

export interface Question {
  id: string;
  name: string;
  type: QuestionType;
  options?: Option[];
  value: string | number;
}

export interface Option {
  id: string;
  value: string;
  label: string;
}

export type FilterClauseCondition =
  | 'equals'
  | 'does_not_equal'
  | 'greater_than'
  | 'less_than';

export type FilterClauseType = {
  id: string;
  condition: FilterClauseCondition;
  value: number | string;
};

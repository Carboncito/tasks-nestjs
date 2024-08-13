import { Injectable, PipeTransform } from '@nestjs/common';

export interface QueryParamsProjects {
  all?: boolean;
}

@Injectable()
export class QueryParamsProjectsPipe implements PipeTransform {
  transform(value: QueryParamsProjects): QueryParamsProjects {
    const getAll = Boolean(value.all);

    return { ...value, all: getAll };
  }
}

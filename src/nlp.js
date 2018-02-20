import { default as natural, } from 'natural';
import { ColumnVectorizer, } from './ColumnVectorizer';

/**
 * @namespace
 * @see {@link https://github.com/NaturalNode/natural} 
 */
export const nlp = Object.assign({
  ColumnVectorizer,
}, natural);
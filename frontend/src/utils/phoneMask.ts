import { maskValue } from './mask';

export default function phoneMask(value: string) {
  const onlyNums = value.replace(/[^0-9]/g, '');
  const mask = onlyNums.length <= 10 ? '(##) ####-####' : '(##) # ####-####';
  return maskValue(onlyNums, mask);
}

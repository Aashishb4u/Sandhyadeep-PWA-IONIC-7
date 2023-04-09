import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countDownPipe'
})
export class CountDownPipePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

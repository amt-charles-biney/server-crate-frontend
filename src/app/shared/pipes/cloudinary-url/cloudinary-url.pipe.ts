import { Pipe, PipeTransform } from '@angular/core';
import { removeCloudinaryBaseUrl } from '../../../core/utils/helpers';

@Pipe({
  name: 'cloudinaryUrl',
  standalone: true
})
export class CloudinaryUrlPipe implements PipeTransform {
  transform(value: string): string {    
    return removeCloudinaryBaseUrl(value);
  }
}

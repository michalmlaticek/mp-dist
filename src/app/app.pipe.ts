import { Pipe } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe {
    transform(value: string, args?: number): string {
        let limit = args === undefined ? 15 : args;
        let trail = '...';

        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}
import { Dimensions } from '../dimensions';
import { Column } from '../column';
import { Settings } from '../settings';

describe('Dimensions', () => {
  const settings = new Settings({});
  const columns = [
    new Column({ name: 'test1', frozen: true, width: 100 }, settings),
    new Column({ name: 'test2', frozen: true, width: 100 }, settings),
    new Column({ name: 'test3', frozen: false, width: 100 }, settings),
    new Column({ name: 'test4', frozen: false, width: 100 }, settings),
    new Column({ name: 'test5', frozen: false, width: 100 }, settings),
    new Column({ name: 'test6', tableHidden: true, width: 100 }, settings),
  ];
  const dimensions = new Dimensions(settings, columns);

  it('should be able to calc columns widths', () => {
    dimensions.calcColumnsTotalWidth();
    expect(dimensions.columnsTotalWidth).toBe(540);
    expect(dimensions.frozenColumnsWidth).toBe(200);
    expect(dimensions.scrollableColumnsWidth).toBe(300);
  });

});
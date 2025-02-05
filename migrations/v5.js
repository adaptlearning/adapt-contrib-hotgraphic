import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Graphic - v4.2.1 to v5.0.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v4.2.1', { name: 'adapt-contrib-hotgraphic', version: '<5.0.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - remove item _graphic.title', async (content) => {
    hotgraphics.forEach(hotgraphic => _.set(hotgraphic, '_isRound', false));
    return true;
  });
  mutateContent('Hot Graphic - remove item pinAlt attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => { _items.forEach(item => delete item.pinAlt); });
    return true;
  });
  checkContent('Hot Graphic - check _isRound attribute', async content => {
    const isValid = hotgraphics.every(hotgraphic => hotgraphic?._isRound === false);
    if (!isValid) throw new Error('Hot Graphic - _isRound attribute invalid');
    return true;
  });
  checkContent('Hot Graphic - check item pinAlt attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every(item => item?.pinAlt === undefined));
    if (!isValid) throw new Error('Hot Graphic - item pinAlt attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v5.0.0', { name: 'adapt-contrib-hotgraphic', version: '5.0.0', framework: '>=5.0.0' });
});

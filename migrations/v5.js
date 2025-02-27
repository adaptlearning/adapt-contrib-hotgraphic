import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Graphic - v4.3.0 to v5.0.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v4.3.0', { name: 'adapt-contrib-hotgraphic', version: '<5.0.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add _isRound attribute', async (content) => {
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

describe('Hot Graphic - v5.1.1 to v5.2.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v5.1.1', { name: 'adapt-contrib-hotgraphic', version: '<5.2.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add _useNumberedPins', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_useNumberedPins')) _.set(hotgraphic, '_useNumberedPins', false);
    });
    return true;
  });
  checkContent('Hot Graphic - check _useNumberedPins attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic?._useNumberedPins === false);
    if (!isValid) throw new Error('Hot Graphic - _useNumberedPins attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v5.2.0', { name: 'adapt-contrib-hotgraphic', version: '5.2.0', framework: '>=5.5.0' });
});

describe('Hot Graphic - v5.2.0 to v5.3.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v5.2.0', { name: 'adapt-contrib-hotgraphic', version: '<5.3.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add _isNarrativeOnMobile', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_isNarrativeOnMobile')) _.set(hotgraphic, '_isNarrativeOnMobile', true);
    });
    return true;
  });
  checkContent('Hot Graphic - check _isNarrativeOnMobile attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic?._isNarrativeOnMobile === true);
    if (!isValid) throw new Error('Hot Graphic - _isNarrativeOnMobile attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v5.3.0', { name: 'adapt-contrib-hotgraphic', version: '5.3.0', framework: '>=5.5.0' });
});

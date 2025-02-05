import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Graphic - v5.3.0 to v6.1.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v5.3.0', { name: 'adapt-contrib-hotgraphic', version: '<6.1.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add _isMobileTextBelowImage', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_isMobileTextBelowImage')) _.set(hotgraphic, '_isMobileTextBelowImage', false);
    });
    return true;
  });
  checkContent('Hot Graphic - check _isMobileTextBelowImage attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic?._isMobileTextBelowImage === false);
    if (!isValid) throw new Error('Hot Graphic - _isMobileTextBelowImage attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v6.1.0', { name: 'adapt-contrib-hotgraphic', version: '6.1.0', framework: '>=5.19.1' });
});

describe('Hot Graphic - v6.1.0 to v6.5.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v6.1.0', { name: 'adapt-contrib-hotgraphic', version: '<6.5.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add item _imageAlignment attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => { _items.forEach(item => { _.set(item, '_imageAlignment', 'right'); }); });
    return true;
  });
  checkContent('Hot Graphic - check item _imageAlignment attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every(item => item?._imageAlignment === 'right'));
    if (!isValid) throw new Error('Hot Graphic - item _imageAlignment attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v6.5.0', { name: 'adapt-contrib-hotgraphic', version: '6.5.0', framework: '>=5.19.1' });
});

describe('Hot Graphic - v6.5.0 to v6.5.1', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v6.5.0', { name: 'adapt-contrib-hotgraphic', version: '<6.5.1' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });

  updatePlugin('Hot Graphic - update to v6.5.1', { name: 'adapt-contrib-hotgraphic', version: '6.5.1', framework: '>=5.19.1' });
});

describe('Hot Graphic - v6.5.1 to v6.6.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v6.5.1', { name: 'adapt-contrib-hotgraphic', version: '<6.6.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });

  updatePlugin('Hot Graphic - update to v6.6.0', { name: 'adapt-contrib-hotgraphic', version: '6.6.0', framework: '>=5.19.1' });
});

describe('Hot Graphic - v6.6.0 to v6.7.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v6.6.0', { name: 'adapt-contrib-hotgraphic', version: '<6.7.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add item _tooltip object', async (content) => {
    hotgraphics.forEach(({ _items }) => { _items.forEach(item => { _.set(item, '_tooltip', {}); }); });
    return true;
  });
  mutateContent('Hot Graphic - add item _tooltip._isEnabled attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => { _items.forEach(({ _tooltip }) => { _.set(_tooltip, '_isEnabled', false); }); });
    return true;
  });
  mutateContent('Hot Graphic - add item _tooltip.text attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => { _items.forEach(({ _tooltip }) => { _.set(_tooltip, 'text', '{{ariaLabel}}'); }); });
    return true;
  });
  checkContent('Hot Graphic - check item _tooltip attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every((item) => item?._tooltip !== undefined));
    if (!isValid) throw new Error('Hot Graphic - item _tooltip attribute invalid');
    return true;
  });
  checkContent('Hot Graphic - check item _tooltip._isEnabled attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every((item) => item?._tooltip?._isEnabled === false));
    if (!isValid) throw new Error('Hot Graphic - item _tooltip._isEnabled attribute invalid');
    return true;
  });
  checkContent('Hot Graphic - check item _tooltip.text attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every((item) => item?._tooltip?.text === '{{ariaLabel}}'));
    if (!isValid) throw new Error('Hot Graphic - item _tooltip.text attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v6.7.0', { name: 'adapt-contrib-hotgraphic', version: '6.7.0', framework: '>=5.30.2' });
});

describe('Hot Graphic - v6.7.0 to v6.11.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v6.7.0', { name: 'adapt-contrib-hotgraphic', version: '<6.11.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });

  updatePlugin('Hot Graphic - update to v6.11.0', { name: 'adapt-contrib-hotgraphic', version: '6.11.0', framework: '>=5.33.10' });
});

describe('Hot Graphic - v6.11.0 to v6.12.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v6.11.0', { name: 'adapt-contrib-hotgraphic', version: '<6.12.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add _pinOffsetOrigin', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_pinOffsetOrigin')) _.set(hotgraphic, '_pinOffsetOrigin', false);
    });
    return true;
  });
  checkContent('Hot Graphic - check _pinOffsetOrigin attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic?._pinOffsetOrigin === false);
    if (!isValid) throw new Error('Hot Graphic - _pinOffsetOrigin attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v6.12.0', { name: 'adapt-contrib-hotgraphic', version: '6.12.0', framework: '>=5.33.10' });
});

describe('Hot Graphic - v6.12.0 to v6.12.1', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v6.12.0', { name: 'adapt-contrib-hotgraphic', version: '<6.12.1' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add _isStackedOnMobile', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_isStackedOnMobile')) _.set(hotgraphic, '_isStackedOnMobile', false);
    });
    return true;
  });
  checkContent('Hot Graphic - check _isStackedOnMobile attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic?._isStackedOnMobile === false);
    if (!isValid) throw new Error('Hot Graphic - _isStackedOnMobile attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v6.12.1', { name: 'adapt-contrib-hotgraphic', version: '6.12.1', framework: '>=5.33.10' });
});

describe('Hot Graphic - v6.12.1 to v6.13.1', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v6.12.1', { name: 'adapt-contrib-hotgraphic', version: '<6.13.1' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add _hasStaticTooltips', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_hasStaticTooltips')) _.set(hotgraphic, '_hasStaticTooltips', false);
    });
    return true;
  });
  checkContent('Hot Graphic - check _hasStaticTooltips attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic?._hasStaticTooltips === false);
    if (!isValid) throw new Error('Hot Graphic - _hasStaticTooltips attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v6.13.1', { name: 'adapt-contrib-hotgraphic', version: '6.13.1', framework: '>=5.39.12' });
});

describe('Hot Graphic - v6.13.1 to v6.15.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v6.13.1', { name: 'adapt-contrib-hotgraphic', version: '<6.15.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });

  updatePlugin('Hot Graphic - update to v6.15.0', { name: 'adapt-contrib-hotgraphic', version: '6.15.0', framework: '>=5.39.12' });
});

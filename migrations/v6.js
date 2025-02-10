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
    hotgraphics.forEach(({ _items }) => {
      return _items.forEach(item => { _.set(item, '_imageAlignment', 'right'); });
    });
    return true;
  });
  checkContent('Hot Graphic - check item _imageAlignment attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => {
      return _items.every(item => item?._imageAlignment === 'right');
    });
    if (!isValid) throw new Error('Hot Graphic - item _imageAlignment attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v6.5.0', { name: 'adapt-contrib-hotgraphic', version: '6.5.0', framework: '>=5.19.1' });
});

describe('Hot Graphic - v6.5.0 to v6.5.2', async () => {
  let hotgraphics, course, courseHotgraphicGlobals;
  whereFromPlugin('Hot Graphic - from v6.5.0', { name: 'adapt-contrib-hotgraphic', version: '<6.5.2' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add globals item attribute', async content => {
    course = content.find(({ _type }) => _type === 'course');
    courseHotgraphicGlobals = course._globals._components._hotgraphic;
    courseHotgraphicGlobals.item = 'Item {{itemNumber}} of {{totalItems}}';
    return true;
  });
  mutateContent('Hot Graphic - add globals previous attribute', async content => {
    courseHotgraphicGlobals.previous = '{{#if title}}Back to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.previous}}{{/if}}';
    return true;
  });
  mutateContent('Hot Graphic - add globals next attribute', async content => {
    courseHotgraphicGlobals.next = '{{#if title}}Forward to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.next}}{{/if}}';
    return true;
  });
  checkContent('Hot Graphic - check globals item attribute', async content => {
    course = content.find(({ _type }) => _type === 'course');
    courseHotgraphicGlobals = course._globals._components._hotgraphic;
    if (courseHotgraphicGlobals?.item !== 'Item {{itemNumber}} of {{totalItems}}') {
      throw new Error('Hot Graphic - globals item invalid');
    }
    return true;
  });
  checkContent('Hot Graphic - check globals previous attribute', async content => {
    if (courseHotgraphicGlobals?.previous !== '{{#if title}}Back to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.previous}}{{/if}}') {
      throw new Error('Hot Graphic - globals previous invalid');
    }
    return true;
  });
  checkContent('Hot Graphic - check globals next attribute', async content => {
    if (courseHotgraphicGlobals?.next !== '{{#if title}}Forward to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.next}}{{/if}}') {
      throw new Error('Hot Graphic - globals next invalid');
    }
    return true;
  });
  updatePlugin('Hot Graphic - update to v6.5.2', { name: 'adapt-contrib-hotgraphic', version: '6.5.2', framework: '>=5.19.1' });
});

describe('Hot Graphic - v6.5.2 to v6.6.0', async () => {
  let hotgraphics;
  const originalInstructionDefault = '';
  const originalMobileInstructionDefault = '';
  whereFromPlugin('Hot Graphic - from v6.5.1', { name: 'adapt-contrib-hotgraphic', version: '<6.6.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - update instruction ', async (content) => {
    hotgraphics.forEach((hotgraphic) => {
      if (hotgraphic.instruction === originalInstructionDefault) {
        hotgraphic.instruction = 'Select the icons to find out more.';
      }
    });
    return true;
  });
  mutateContent('Hot Graphic - update mobileInstruction ', async (content) => {
    hotgraphics.forEach((hotgraphic) => {
      if (hotgraphic.mobileInstruction === originalMobileInstructionDefault) {
        hotgraphic.mobileInstruction = 'Select the plus icon followed by the next arrow to find out more.';
      }
    });
    return true;
  });
  checkContent('Hot Graphic - check instruction attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => {
      return hotgraphic?.instruction !== originalInstructionDefault;
    });
    if (!isValid) throw new Error('Hot Graphic - instruction attribute invalid');
    return true;
  });
  checkContent('Hot Graphic - check mobileInstruction attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => {
      return hotgraphic?.mobileInstruction !== originalMobileInstructionDefault;
    });
    if (!isValid) throw new Error('Hot Graphic - mobileInstruction attribute invalid');
    return true;
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
    hotgraphics.forEach(({ _items }) => {
      return _items.forEach(item => { _.set(item, '_tooltip', {}); });
    });
    return true;
  });
  mutateContent('Hot Graphic - add item _tooltip._isEnabled attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => {
      return _items.forEach(({ _tooltip }) => { _.set(_tooltip, '_isEnabled', false); });
    });
    return true;
  });
  mutateContent('Hot Graphic - add item _tooltip.text attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => {
      return _items.forEach(({ _tooltip }) => { _.set(_tooltip, 'text', '{{ariaLabel}}'); });
    });
    return true;
  });
  checkContent('Hot Graphic - check item _tooltip attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => {
      return _items.every((item) => item?._tooltip !== undefined);
    });
    if (!isValid) throw new Error('Hot Graphic - item _tooltip attribute invalid');
    return true;
  });
  checkContent('Hot Graphic - check item _tooltip._isEnabled attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => {
      return _items.every((item) => item?._tooltip?._isEnabled === false);
    });
    if (!isValid) throw new Error('Hot Graphic - item _tooltip._isEnabled attribute invalid');
    return true;
  });
  checkContent('Hot Graphic - check item _tooltip.text attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => {
      return _items.every((item) => item?._tooltip?.text === '{{ariaLabel}}');
    });
    if (!isValid) throw new Error('Hot Graphic - item _tooltip.text attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v6.7.0', { name: 'adapt-contrib-hotgraphic', version: '6.7.0', framework: '>=5.30.2' });
});

describe('Hot Graphic - v6.7.0 to v6.11.0', async () => {
  let hotgraphics, course, courseHotgraphicGlobals;
  whereFromPlugin('Hot Graphic - from v6.7.0', { name: 'adapt-contrib-hotgraphic', version: '<6.11.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - update globals item attribute', async content => {
    course = content.find(({ _type }) => _type === 'course');
    courseHotgraphicGlobals = course._globals._components._hotgraphic;
    if (courseHotgraphicGlobals?.item === 'Item {{{itemNumber}}} of {{{totalItems}}}') {
      courseHotgraphicGlobals.item = 'Item {{itemNumber}} of {{totalItems}}'; // remove extra brackets
    }
    return true;
  });
  checkContent('Hot Graphic - check updated globals item attribute', async content => {
    const isValid = (courseHotgraphicGlobals?.item === 'Item {{itemNumber}} of {{totalItems}}');
    if (!isValid) throw new Error('Hot Graphic - globals item attribute invalid');
    return true;
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
  mutateContent('Hot Graphic - add item _tooltip._position attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => {
      return _items.forEach(({ _tooltip }) => { _.set(_tooltip, '_position', ''); });
    });
    return true;
  });
  checkContent('Hot Graphic - check _hasStaticTooltips attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic?._hasStaticTooltips === false);
    if (!isValid) throw new Error('Hot Graphic - _hasStaticTooltips attribute invalid');
    return true;
  });
  checkContent('Hot Graphic - check item _tooltip._position attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => {
      return _items.every((item) => item?._tooltip?._position === '');
    });
    if (!isValid) throw new Error('Hot Graphic - item _tooltip._position attribute invalid');
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
  mutateContent('Hot Graphic - add _pin.srcHover attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => {
      return _items.forEach(({ _pin }) => { _.set(_pin, 'srcHover', ''); });
    });
    return true;
  });
  mutateContent('Hot Graphic - add _pin.srcVisited attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => {
      return _items.forEach(({ _pin }) => { _.set(_pin, 'srcVisited', ''); });
    });
    return true;
  });
  checkContent('Hot Graphic - check item _pin.srcHover attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => {
      return _items.every((item) => item?._pin?.srcHover === '');
    });
    if (!isValid) throw new Error('Hot Graphic - item _pin.srcHover attribute invalid');
    return true;
  });
  checkContent('Hot Graphic - check item _pin.srcVisited attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => {
      return _items.every((item) => item?._pin?.srcVisited === '');
    });
    if (!isValid) throw new Error('Hot Graphic - item _pin.srcVisited attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v6.15.0', { name: 'adapt-contrib-hotgraphic', version: '6.15.0', framework: '>=5.39.12' });
});

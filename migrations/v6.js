import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getComponents, getCourse, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Graphic - v6.0.0 to v6.1.0', async () => {
  let hotgraphics;

  whereFromPlugin('Hot Graphic - from v6.0.0', { name: 'adapt-contrib-hotgraphic', version: '<6.1.0' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
    return hotgraphics.length;
  });

  mutateContent('Hot Graphic - add _isMobileTextBelowImage', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_isMobileTextBelowImage')) _.set(hotgraphic, '_isMobileTextBelowImage', false);
    });
    return true;
  });

  checkContent('Hot Graphic - check _isMobileTextBelowImage attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => _.has(hotgraphic, '_isMobileTextBelowImage'));
    if (!isValid) throw new Error('Hot Graphic - _isMobileTextBelowImage attribute invalid');
    return true;
  });

  updatePlugin('Hot Graphic - update to v6.1.0', { name: 'adapt-contrib-hotgraphic', version: '6.1.0', framework: '>=5.19.1' });

  testSuccessWhere('non/configured hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.0.0' }],
    content: [
      {
        _id: 'c-100',
        _component: 'hotgraphic'
      },
      {
        _id: 'c-105',
        _component: 'hotgraphic',
        _isMobileTextBelowImage: false
      },
      { _type: 'course' }
    ]
  });

  testStopWhere('no hotgraphic components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.0.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.1.0' }]
  });
});

describe('Hot Graphic - v6.4.0 to v6.5.0', async () => {
  let hotgraphics;

  whereFromPlugin('Hot Graphic - from v6.4.0', { name: 'adapt-contrib-hotgraphic', version: '<6.5.0' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
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

  testSuccessWhere('non/configured hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.4.0' }],
    content: [
      {
        _id: 'c-100',
        _component: 'hotgraphic',
        _items: [
          {
            title: 'Hotspot 1 title',
            body: 'This is display text 1.'
          },
          {
            title: 'Hotspot 2 title',
            body: 'This is display text 2.'
          }
        ]
      },
      { _type: 'course' }
    ]
  });

  testStopWhere('no hotgraphic components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.4.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.5.0' }]
  });
});

describe('Hot Graphic - v6.5.1 to v6.5.2', async () => {
  let course, courseHotgraphicGlobals;
  const itemGlobal = 'Item {{itemNumber}} of {{totalItems}}';
  const previousGlobal = '{{#if title}}Back to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.previous}}{{/if}}';
  const nextGlobal = '{{#if title}}Forward to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.next}}{{/if}}';

  whereFromPlugin('Hot Graphic - from v6.5.1', { name: 'adapt-contrib-hotgraphic', version: '<6.5.2' });

  mutateContent('Hot Graphic - add globals item attribute', async content => {
    course = getCourse();
    if (!_.has(course, '_globals._components._hotgraphic')) _.set(course, '_globals._components._hotgraphic', {});
    courseHotgraphicGlobals = course._globals._components._hotgraphic;
    courseHotgraphicGlobals.item = itemGlobal;
    return true;
  });

  mutateContent('Hot Graphic - add globals previous attribute', async content => {
    courseHotgraphicGlobals.previous = previousGlobal;
    return true;
  });

  mutateContent('Hot Graphic - add globals next attribute', async content => {
    courseHotgraphicGlobals.next = nextGlobal;
    return true;
  });

  checkContent('Hot Graphic - check globals item attribute', async content => {
    if (courseHotgraphicGlobals?.item !== itemGlobal) {
      throw new Error('Hot Graphic - globals item invalid');
    }
    return true;
  });

  checkContent('Hot Graphic - check globals previous attribute', async content => {
    if (courseHotgraphicGlobals?.previous !== previousGlobal) {
      throw new Error('Hot Graphic - globals previous invalid');
    }
    return true;
  });

  checkContent('Hot Graphic - check globals next attribute', async content => {
    if (courseHotgraphicGlobals?.next !== nextGlobal) {
      throw new Error('Hot Graphic - globals next invalid');
    }
    return true;
  });

  updatePlugin('Hot Graphic - update to v6.5.2', { name: 'adapt-contrib-hotgraphic', version: '6.5.2', framework: '>=5.19.1' });

  testSuccessWhere('hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.5.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _type: 'course' }
    ]
  });

  testSuccessWhere('hotgraphic component with empty course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.5.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _type: 'course', _globals: { _components: { _hotgraphic: {} } } }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.5.2' }]
  });
});

describe('Hot Graphic - v6.5.5 to v6.6.0', async () => {
  let hotgraphics;
  const newInstruction = 'Select the icons to find out more.';
  const newMobileInstruction = 'Select the plus icon followed by the next arrow to find out more.';

  whereFromPlugin('Hot Graphic - from v6.5.5', { name: 'adapt-contrib-hotgraphic', version: '<6.6.0' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
    return hotgraphics.length;
  });

  mutateContent('Hot Graphic - update instruction ', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, 'instruction')) _.set(hotgraphic, 'instruction', newInstruction);
      if (hotgraphic.instruction === '') hotgraphic.instruction = newInstruction;
    });
    return true;
  });

  mutateContent('Hot Graphic - update mobileInstruction ', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, 'mobileInstruction')) _.set(hotgraphic, 'mobileInstruction', newMobileInstruction);
      if (hotgraphic.mobileInstruction === '') hotgraphic.mobileInstruction = newMobileInstruction;
    });
    return true;
  });

  checkContent('Hot Graphic - check instruction attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => _.has(hotgraphic, 'instruction'));
    if (!isValid) throw new Error('Hot Graphic - instruction attribute invalid');
    return true;
  });

  checkContent('Hot Graphic - check mobileInstruction attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => _.has(hotgraphic, 'mobileInstruction'));
    if (!isValid) throw new Error('Hot Graphic - mobileInstruction attribute invalid');
    return true;
  });

  updatePlugin('Hot Graphic - update to v6.6.0', { name: 'adapt-contrib-hotgraphic', version: '6.6.0', framework: '>=5.19.1' });

  testSuccessWhere('hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.5.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic', instruction: '', mobileInstruction: '' },
      { _id: 'c-105', _component: 'hotgraphic' },
      { _id: 'c-110', _component: 'hotgraphic', instruction: 'customInstruction', mobileInstruction: 'custom mobileInstruction' },
      { _type: 'course' }
    ]
  });

  testSuccessWhere('hotgraphic component with empty course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.5.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _type: 'course', _globals: { _components: { _hotgraphic: {} } } }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.6.0' }]
  });
});

describe('Hot Graphic - v6.6.4 to v6.7.0', async () => {
  let hotgraphics;

  whereFromPlugin('Hot Graphic - from v6.6.4', { name: 'adapt-contrib-hotgraphic', version: '<6.7.0' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
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

  testSuccessWhere('non/configured hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.6.0' }],
    content: [
      {
        _id: 'c-100',
        _component: 'hotgraphic',
        _items: [
          {
            title: 'Hotspot 1 title',
            body: 'This is display text 1.'
          },
          {
            title: 'Hotspot 2 title',
            body: 'This is display text 2.'
          }
        ]
      },
      { _type: 'course' }
    ]
  });

  testStopWhere('no hotgraphic components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.6.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.7.0' }]
  });
});

describe('Hot Graphic - v6.11.3 to v6.12.0', async () => {
  let hotgraphics, course, courseHotgraphicGlobals;
  const originalItem = 'Item {{{itemNumber}}} of {{{totalItems}}}';
  const updatedItem = 'Item {{itemNumber}} of {{totalItems}}';

  whereFromPlugin('Hot Graphic - from v6.11.3', { name: 'adapt-contrib-hotgraphic', version: '<6.12.0' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
    return hotgraphics.length;
  });

  mutateContent('Hot Graphic - add _pinOffsetOrigin', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_pinOffsetOrigin')) _.set(hotgraphic, '_pinOffsetOrigin', false);
    });
    return true;
  });

  mutateContent('Hot Graphic - update globals item attribute', async content => {
    course = getCourse();
    if (!_.has(course, '_globals._components._hotgraphic.item')) {
      _.set(course, '_globals._components._hotgraphic.item', updatedItem);
    }
    courseHotgraphicGlobals = course._globals._components._hotgraphic;
    if (courseHotgraphicGlobals.item === originalItem) {
      courseHotgraphicGlobals.item = updatedItem;
    }
    return true;
  });

  checkContent('Hot Graphic - check _pinOffsetOrigin attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic?._pinOffsetOrigin === false);
    if (!isValid) throw new Error('Hot Graphic - _pinOffsetOrigin attribute invalid');
    return true;
  });

  checkContent('Hot Graphic - check updated globals item attribute', async content => {
    const isValid = (courseHotgraphicGlobals?.item !== originalItem);
    if (!isValid) throw new Error('Hot Graphic - globals item attribute invalid');
    return true;
  });

  updatePlugin('Hot Graphic - update to v6.12.0', { name: 'adapt-contrib-hotgraphic', version: '6.12.0', framework: '>=5.33.10' });

  testSuccessWhere('hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.11.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _id: 'c-105', _component: 'hotgraphic' },
      { _type: 'course' }
    ]
  });

  testSuccessWhere('hotgraphic component with empty course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.11.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _type: 'course', _globals: { _components: { _hotgraphic: { item: originalItem } } } }
    ]
  });

  testStopWhere('no hotgraphic components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.6.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.12.0' }]
  });
});

describe('Hot Graphic - v6.12.0 to v6.12.1', async () => {
  let hotgraphics;

  whereFromPlugin('Hot Graphic - from v6.12.0', { name: 'adapt-contrib-hotgraphic', version: '<6.12.1' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
    return hotgraphics.length;
  });

  mutateContent('Hot Graphic - add _isStackedOnMobile', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_isStackedOnMobile')) _.set(hotgraphic, '_isStackedOnMobile', false);
    });
    return true;
  });

  checkContent('Hot Graphic - check _isStackedOnMobile attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => _.has(hotgraphic, '_isStackedOnMobile'));
    if (!isValid) throw new Error('Hot Graphic - _isStackedOnMobile attribute invalid');
    return true;
  });

  updatePlugin('Hot Graphic - update to v6.12.1', { name: 'adapt-contrib-hotgraphic', version: '6.12.1', framework: '>=5.33.10' });

  testSuccessWhere('hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.12.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _id: 'c-105', _component: 'hotgraphic', _isStackedOnMobile: false },
      { _type: 'course' }
    ]
  });

  testStopWhere('no hotgraphic components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.12.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.12.1' }]
  });
});

describe('Hot Graphic - v6.12.1 to v6.13.1', async () => {
  let hotgraphics;

  whereFromPlugin('Hot Graphic - from v6.12.1', { name: 'adapt-contrib-hotgraphic', version: '<6.13.1' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
    return hotgraphics.length;
  });

  mutateContent('Hot Graphic - add _hasStaticTooltips', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_hasStaticTooltips')) _.set(hotgraphic, '_hasStaticTooltips', false);
    });
    return true;
  });

  mutateContent('Hot Graphic - add item _tooltip._position attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => { _items.forEach(item => { _.set(item, '_tooltip._position', ''); }); });
    return true;
  });

  checkContent('Hot Graphic - check _hasStaticTooltips attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic?._hasStaticTooltips === false);
    if (!isValid) throw new Error('Hot Graphic - _hasStaticTooltips attribute invalid');
    return true;
  });

  checkContent('Hot Graphic - check item _tooltip._position attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every((item) => item?._tooltip?._position === ''));
    if (!isValid) throw new Error('Hot Graphic - item _tooltip._position attribute invalid');
    return true;
  });

  updatePlugin('Hot Graphic - update to v6.13.1', { name: 'adapt-contrib-hotgraphic', version: '6.13.1', framework: '>=5.39.12' });

  testSuccessWhere('hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.13.0' }],
    content: [
      {
        _id: 'c-100',
        _component: 'hotgraphic',
        _items: [
          {
            title: 'Hotspot 1 title',
            body: 'This is display text 1.'
          },
          {
            title: 'Hotspot 2 title',
            body: 'This is display text 2.'
          }
        ]
      },
      { _type: 'course' }
    ]
  });

  testStopWhere('no hotgraphic components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.13.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.13.1' }]
  });
});

describe('Hot Graphic - v6.14.2 to v6.15.0', async () => {
  let hotgraphics;

  whereFromPlugin('Hot Graphic - from v6.14.2', { name: 'adapt-contrib-hotgraphic', version: '<6.15.0' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
    return hotgraphics.length;
  });

  mutateContent('Hot Graphic - add _pin.srcHover attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => _items.forEach(item => _.set(item, '_pin.srcHover', '')));
    return true;
  });

  mutateContent('Hot Graphic - add _pin.srcVisited attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => _items.forEach(item => _.set(item, '_pin.srcVisited', '')));
    return true;
  });

  checkContent('Hot Graphic - check item _pin.srcHover attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every(item => _.has(item, '_pin.srcHover')));
    if (!isValid) throw new Error('Hot Graphic - item _pin.srcHover attribute invalid');
    return true;
  });

  checkContent('Hot Graphic - check item _pin.srcVisited attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every(item => _.has(item, '_pin.srcVisited')));
    if (!isValid) throw new Error('Hot Graphic - item _pin.srcVisited attribute invalid');
    return true;
  });

  updatePlugin('Hot Graphic - update to v6.15.0', { name: 'adapt-contrib-hotgraphic', version: '6.15.0', framework: '>=5.39.12' });

  testSuccessWhere('non/configured hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.14.0' }],
    content: [
      {
        _id: 'c-100',
        _component: 'hotgraphic',
        _items: [
          {
            title: 'Hotspot 1 title',
            body: 'This is display text 1.'
          },
          {
            title: 'Hotspot 2 title',
            body: 'This is display text 2.'
          }
        ]
      },
      { _type: 'course' }
    ]
  });

  testStopWhere('no hotgraphic components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.14.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '6.15.0' }]
  });
});

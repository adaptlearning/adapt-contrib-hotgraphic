import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getComponents, getCourse, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Graphic - v3.0.1 to v4.0.0', async () => {
  let course, courseHotgraphicGlobals;

  whereFromPlugin('Hot Graphic - from v3.0.1', { name: 'adapt-contrib-hotgraphic', version: '<4.0.0' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    course = getCourse();
    courseHotgraphicGlobals = course?._globals?._components?._hotgraphic;
    return courseHotgraphicGlobals?.ariaPopupLabel;
  });

  mutateContent('Hot Graphic - remove globals ariaPopupLabel', async (content) => {
    _.unset(courseHotgraphicGlobals, 'ariaPopupLabel');
    return true;
  });

  checkContent('Hot Graphic - check globals ariaPopupLabel', async content => {
    if (courseHotgraphicGlobals?.ariaPopupLabel !== undefined) throw new Error('Hot Graphic - globals _hotgraphic ariaPopupLabel invalid');
    return true;
  });

  updatePlugin('Hot Graphic - update to v4.0.0', { name: 'adapt-contrib-hotgraphic', version: '4.0.0', framework: '>=3.3.0' });

  testSuccessWhere('hotgraphic component with custom course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '3.0.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _id: 'c-105', _component: 'hotgraphic' },
      { _type: 'course', _globals: { _components: { _hotgraphic: { ariaPopupLabel: 'ariaPopupLabel' } } } }
    ]
  });

  testStopWhere('hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '3.0.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _id: 'c-105', _component: 'hotgraphic' },
      { _type: 'course' }
    ]
  });

  testStopWhere('hotgraphic component with empty course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '3.0.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _id: 'c-105', _component: 'hotgraphic' },
      { _type: 'course', _globals: { _components: { _hotgraphic: {} } } }
    ]
  });

  testStopWhere('no hotgraphic components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '3.0.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '4.0.0' }]
  });
});

describe('Hot Graphic - v4.0.0 to v4.1.0', async () => {
  let hotgraphics;

  whereFromPlugin('Hot Graphic - from v4.0.0', { name: 'adapt-contrib-hotgraphic', version: '<4.1.0' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
    return hotgraphics.length;
  });

  mutateContent('Hot Graphic - add _setCompletionOn', async (content) => {
    hotgraphics.forEach(hotgraphic => {
      if (!_.has(hotgraphic, '_setCompletionOn')) _.set(hotgraphic, '_setCompletionOn', 'allItems');
    });
    return true;
  });

  checkContent('Hot Graphic - check _setCompletionOn attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic?._setCompletionOn === 'allItems');
    if (!isValid) throw new Error('Hot Graphic - _setCompletionOn attribute invalid');
    return true;
  });

  updatePlugin('Hot Graphic - update to v4.1.0', { name: 'adapt-contrib-hotgraphic', version: '4.1.0', framework: '>=3.3.0' });

  testSuccessWhere('hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '4.0.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _id: 'c-105', _component: 'hotgraphic' },
      { _type: 'course' }
    ]
  });

  testStopWhere('no hotgraphic components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '4.0.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '4.1.0' }]
  });
});

describe('Hot Graphic - v4.1.0 to v4.2.0', async () => {
  let hotgraphics;

  whereFromPlugin('Hot Graphic - from v4.1.0', { name: 'adapt-contrib-hotgraphic', version: '<4.2.0' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
    return hotgraphics.length;
  });

  mutateContent('Hot Graphic - add _pin object', async (content) => {
    hotgraphics.forEach(({ _items }) => { _items.forEach(item => { _.set(item, '_pin', {}); }); });
    return true;
  });

  mutateContent('Hot Graphic - add _pin.src attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => { _items.forEach(({ _pin }) => { _.set(_pin, 'src', ''); }); });
    return true;
  });

  mutateContent('Hot Graphic - add _pin.alt attribute', async (content) => {
    hotgraphics.forEach(({ _items }) => { _items.forEach(({ _pin }) => { _.set(_pin, 'alt', ''); }); });
    return true;
  });

  checkContent('Hot Graphic - check item _pin attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every((item) => item?._pin !== undefined));
    if (!isValid) throw new Error('Hot Graphic - item _pin attribute invalid');
    return true;
  });

  checkContent('Hot Graphic - check item _pin.src attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every((item) => item?._pin?.src !== undefined));
    if (!isValid) throw new Error('Hot Graphic - item _pin.src attribute invalid');
    return true;
  });

  checkContent('Hot Graphic - check item _pin.alt attribute', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every((item) => item?._pin?.alt !== undefined));
    if (!isValid) throw new Error('Hot Graphic - item _pin.alt attribute invalid');
    return true;
  });

  updatePlugin('Hot Graphic - update to v4.2.0', { name: 'adapt-contrib-hotgraphic', version: '4.2.0', framework: '>=3.3.0' });

  testSuccessWhere('non/configured hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '4.1.0' }],
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
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '4.1.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '4.2.0' }]
  });
});

describe('Hot Graphic - v4.2.0 to v4.2.1', async () => {
  let hotgraphics;

  whereFromPlugin('Hot Graphic - from v4.2.0', { name: 'adapt-contrib-hotgraphic', version: '<4.2.1' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
    return hotgraphics.length;
  });

  mutateContent('Hot Graphic - remove item _graphic.title', async (content) => {
    hotgraphics.forEach(({ _items }) => {
      _items.forEach(item => { if (_.has(item, '_graphic.title')) _.unset(item, '_graphic.title'); });
    });
    return true;
  });

  checkContent('Hot Graphic - check item _graphic.title', async content => {
    const isValid = hotgraphics.every(({ _items }) => _items.every((item) => !_.has(item, '_graphic.title')));
    if (!isValid) throw new Error('Hot Graphic - item _graphic.title attribute invalid');
    return true;
  });

  updatePlugin('Hot Graphic - update to v4.2.1', { name: 'adapt-contrib-hotgraphic', version: '4.2.1', framework: '>=3.3.0' });

  testSuccessWhere('non/configured hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '4.2.0' }],
    content: [
      {
        _id: 'c-100',
        _component: 'hotgraphic',
        _items: [
          {
            title: 'Hotspot 1 title',
            body: 'This is display text 1.',
            _graphic: { title: 'Graphic title' }
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
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '4.2.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '4.2.1' }]
  });
});

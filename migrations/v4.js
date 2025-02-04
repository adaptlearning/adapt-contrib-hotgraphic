import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Graphic - v3.0.0 to v4.0.0', async () => {
  let hotgraphics, course, courseHotgraphicGlobals;
  whereFromPlugin('Hot Graphic - from v3.0.0', { name: 'adapt-contrib-hotgraphic', version: '<4.0.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - remove globals ariaPopupLabel', async (content) => {
    course = content.find(({ _type }) => _type === 'course');
    courseHotgraphicGlobals = course._globals._components._hotgraphic;
    delete courseHotgraphicGlobals.ariaPopupLabel;
    return true;
  });
  checkContent('Hot Graphic - check globals ariaPopupLabel', async content => {
    if (courseHotgraphicGlobals.ariaPopupLabel !== undefined) throw new Error('Hot Graphic - globals _hotgraphic ariaPopupLabel invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v4.0.0', { name: 'adapt-contrib-hotgraphic', version: '4.0.0', framework: '>=3.3.0' });
});

describe('Hot Graphic - v4.0.0 to v4.1.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v4.0.0', { name: 'adapt-contrib-hotgraphic', version: '<4.1.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add _setCompletionOn', async (content) => {
    hotgraphics.forEach(hotgraphic => { _.set(hotgraphic, '_setCompletionOn', 'allItems'); });
    return true;
  });
  checkContent('Hot Graphic - check _setCompletionOn attribute', async content => {
    const isValid = hotgraphics.every((hotgraphic) => hotgraphic._setCompletionOn !== undefined && hotgraphic._setCompletionOn === 'allItems');
    if (!isValid) throw new Error('Hot Graphic - _setCompletionOn attribute invalid');
    return true;
  });
  updatePlugin('Hot Graphic - update to v4.1.0', { name: 'adapt-contrib-hotgraphic', version: '4.1.0', framework: '>=3.3.0' });
});

describe('Hot Graphic - v4.1.0 to v4.2.0', async () => {
  let hotgraphics;
  whereFromPlugin('Hot Graphic - from v4.1.0', { name: 'adapt-contrib-hotgraphic', version: '<4.2.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  // mutateContent('Hot Graphic - add _pin', async (content) => {
  //   hotgraphics.forEach(hotgraphic => { _.set(hotgraphic, '_setCompletionOn', 'allItems'); });
  //   return true;
  // });
  // checkContent('Hot Graphic - check _setCompletionOn attribute', async content => {
  //   const isValid = hotgraphics.every((hotgraphic) => hotgraphic._setCompletionOn !== 'allItems');
  //   if (!isValid) throw new Error('Hot Graphic - _setCompletionOn attribute invalid');
  //   return true;
  // });
  updatePlugin('Hot Graphic - update to v4.2.0', { name: 'adapt-contrib-hotgraphic', version: '4.2.0', framework: '>=3.3.0' });
});

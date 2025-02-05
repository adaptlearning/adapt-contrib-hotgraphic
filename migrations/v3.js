import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Graphic - v2.1.2 to v3.0.0', async () => {
  let hotgraphics, course, courseHotgraphicGlobals;
  whereFromPlugin('Hot Graphic - from v2.1.2', { name: 'adapt-contrib-hotgraphic', version: '<3.0.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  mutateContent('Hot Graphic - add globals if missing', async (content) => {
    course = content.find(({ _type }) => _type === 'course');
    if (!_.has(course, '_globals._components._hotgraphic')) _.set(course, '_globals._components._hotgraphic', {});
    courseHotgraphicGlobals = course._globals._components._hotgraphic;
    return true;
  });
  mutateContent('Hot Graphic - add popupPagination attribute', async content => {
    courseHotgraphicGlobals.popupPagination = '{{itemNumber}} / {{totalItems}}';
    return true;
  });
  checkContent('Hot Graphic - check globals _hotgraphic attribute', async content => {
    if (courseHotgraphicGlobals === undefined) throw new Error('Hot Graphic - globals _hotgraphic invalid');
    return true;
  });
  checkContent('Hot Graphic - check globals popupPagination attribute', async content => {
    if (courseHotgraphicGlobals?.popupPagination !== '{{itemNumber}} / {{totalItems}}') {
      throw new Error('Hot Graphic - globals popupPagination invalid');
    }
    return true;
  });
  updatePlugin('Hot Graphic - update to v3.0.0', { name: 'adapt-contrib-hotgraphic', version: '3.0.0', framework: '>=3.0.0' });
});

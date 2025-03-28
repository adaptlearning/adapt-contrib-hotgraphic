import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, testStopWhere, testSuccessWhere, getComponents, getCourse } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Graphic - v2.1.2 to v3.0.0', async () => {
  let hotgraphics, course, courseHotgraphicGlobals;
  const popupPagination = '{{itemNumber}} / {{totalItems}}';

  whereFromPlugin('Hot Graphic - from v2.1.2', { name: 'adapt-contrib-hotgraphic', version: '<3.0.0' });

  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = getComponents('hotgraphic');
    return hotgraphics.length;
  });

  mutateContent('Hot Graphic - add globals if missing', async (content) => {
    course = getCourse();
    if (!_.has(course, '_globals._components._hotgraphic.popupPagination')) _.set(course, '_globals._components._hotgraphic.popupPagination', popupPagination);
    courseHotgraphicGlobals = course._globals._components._hotgraphic;
    return true;
  });

  mutateContent('Hot Graphic - add globals popupPagination attribute', async content => {
    courseHotgraphicGlobals.popupPagination = popupPagination;
    return true;
  });

  checkContent('Hot Graphic - check globals _hotgraphic attribute', async content => {
    if (courseHotgraphicGlobals === undefined) throw new Error('Hot Graphic - globals _hotgraphic invalid');
    return true;
  });

  checkContent('Hot Graphic - check globals popupPagination attribute', async content => {
    if (courseHotgraphicGlobals?.popupPagination !== popupPagination) {
      throw new Error('Hot Graphic - globals popupPagination invalid');
    }
    return true;
  });

  updatePlugin('Hot Graphic - update to v3.0.0', { name: 'adapt-contrib-hotgraphic', version: '3.0.0', framework: '>=3.0.0' });

  testSuccessWhere('hotgraphic component with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '2.0.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _id: 'c-105', _component: 'hotgraphic' },
      { _type: 'course' }
    ]
  });

  testSuccessWhere('hotgraphic component with empty course._globals', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '2.0.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgraphic' },
      { _id: 'c-105', _component: 'hotgraphic' },
      { _type: 'course', _globals: { _components: { _hotgraphic: {} } } }
    ]
  });

  testStopWhere('no hotgraphic components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '2.0.0' }],
    content: [
      { _component: 'other' },
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgraphic', version: '3.0.0' }]
  });
});

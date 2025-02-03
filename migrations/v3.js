import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

let hotgraphics;

describe('Hot Graphic - v2.1.2 to v3.0.0', async () => {
  whereFromPlugin('Hot Graphic - from v2.1.2', { name: 'adapt-contrib-hotgraphic', version: '<3.0.0' });
  whereContent('Hot Graphic - where hotgraphic', async content => {
    hotgraphics = content.filter(({ _component }) => _component === 'hotgraphic');
    return hotgraphics.length;
  });
  // mutateContent('Hot Graphic - add _url attribute', async content => {
  //   hotgraphics.forEach(hotgraphic => { _.set(graphic, '_graphic._url', ''); });
  //   return true;
  // });
  // checkContent('Hot Graphic - check _url attribute', async content => {
  //   const isValid = hotgraphics.every(({ _graphic }) => _graphic._url !== undefined);
  //   if (!isValid) throw new Error('Graphic - _graphic._url attribute invalid');
  //   return true;
  // });
  updatePlugin('Hot Graphic - update to vX.X.X', { name: 'adapt-contrib-hotgraphic', version: '3.0.0', framework: '>=3.0.0' });
});

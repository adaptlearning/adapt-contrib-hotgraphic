import Adapt from 'core/js/adapt';
import HotgraphicView from './hotgraphicView';
import ItemsComponentModel from 'core/js/models/itemsComponentModel';

export default Adapt.register('hotgraphic', {
  model: ItemsComponentModel.extend({}),
  view: HotgraphicView
});

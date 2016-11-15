import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import styles from './styles'

const tilesData = [
  {
    img: 'https://secure.img.wfcdn.com/lf/79/hash/33808/16967457/1/Perseus+Tufted+Loveseat.jpg',
    title: 'Sofa',
    author: 'jill111',
  },
  {
    img: 'https://secure.img.wfcdn.com/im/34938a64/resize-w242%5Ecompr-r85/1173/11731414/default_name.jpg',
    title: 'Lamp',
    author: 'pashminu',
  },
  {
    img: 'https://secure.img.wfcdn.com/im/a09a6b6a/resize-w323%5Ecompr-r85/1021/10219791/default_name.jpg',
    title: 'Office Chair',
    author: 'Danson67',
  },
  {
    img: 'https://secure.img.wfcdn.com/lf/79/hash/36985/29777603/1/Victoria+End+Table.jpg',
    title: 'End Table',
    author: 'fancycrave1',
  },
  {
    img: 'https://secure.img.wfcdn.com/lf/79/hash/2664/27510702/1/Cambridge+Arm+Chair.jpg',
    title: 'Arm Chair',
    author: 'Hans',
  },
  {
    img: 'https://secure.img.wfcdn.com/lf/79/hash/1989/13860836/1/3.9+cu.+ft.+Front+Load+Washer.jpg',
    title: 'Washer',
    author: 'fancycravel',
  },
  {
    img: 'https://secure.img.wfcdn.com/lf/79/hash/37311/30054847/1/Signal+Mountain+Coffee+Table+with+Lift+Top.jpg',
    title: 'Coffee Table',
    author: 'jill111',
  }
];

/**
 * This example demonstrates the horizontal scrollable single-line grid list of images.
 */
const PhotoInventory = () => (
  <div style={styles.root}>
    <GridList style={styles.gridList} cols={2.2} cellHeight={150}>
      {tilesData.map((tile) => (
        <GridTile
          key={tile.img}
          title={tile.title}
          actionIcon={<IconButton><StarBorder color="rgb(0, 188, 212)" /></IconButton>}
          titleStyle={styles.titleStyle}
          titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
        >
          <img src={tile.img} />
        </GridTile>
      ))}
    </GridList>
  </div>
);

export default PhotoInventory;
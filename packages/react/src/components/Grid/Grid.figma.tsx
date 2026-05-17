import figma from '@figma/code-connect';
import { Grid } from './Grid';

figma.connect(Grid, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
  props: { 
    cols: figma.enum('Columns', { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '12': 12, 'None': 'none' }),
    gap: figma.enum('Gap', { 'Small': 2, 'Medium': 4, 'Large': 6 })
  },
  example: (props) => <Grid {...props}><div /></Grid>
});

import figma from '@figma/code-connect';
import { Spinner } from './Spinner';

/**
 * Figma Code Connect: Spinner
 * @url https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD
 * 
 * TODO: Replace node-id=TBD with the exact Figma component node ID.
 */
figma.connect(Spinner, "https://figma.com/design/zWCU9TdNWH8GPL04tWr7p3?node-id=TBD", {
    props: { size: figma.enum('Size', { 'Small': 'sm', 'Medium': 'md', 'Large': 'lg', 'XLarge': 'xl' }) },
  example: (props) => <Spinner {...props} />
});

/** Purchase Button Css Styling
 * 
 * Css code stored in a string.
 * 
 * @author Alex Malotky
 */
export const Style = `

    .purchase-tooltip{
        width: 100%;
        height: 100%;
    }

    .purchase-tooltip-text{
        visibility: hidden;
        text-align: center;
        padding: 3px;
        border-radius: 6px;
        position: absolute;
        z-index: 1;
        background-color: grey;
    }

    .purchase-tooltip:hover .purchase-tooltip-text{
        visibility: visible;
    }

    .purchase-form{
        width: 100%;
        height: 100%;
    }

    .purchase-button{
        width: 100%;
        height: 100%;
        background-color: black;
        color: white;
        font-family: Arial,Helvetica,sans-serif;
        font-size: 2em;
        border: none;
        box-sizing: content-box;
    }

    .purchase-hidden{
        position: absolute;
        overflow: hidden;
        clip: rect(0 0 0 0);
        height: 1px;
        width: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
    }
`;
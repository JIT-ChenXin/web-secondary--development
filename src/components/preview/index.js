import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getThemeStyle } from "../themeColor";
const Preview = ({ data, formConfig }) => {
  const [state, setstate] = useState(data)
  const [Splicing, setSplicingL] = useState('')

  useEffect(() => {
    if (state) {
      let temp = JSON.parse(state)
      let Splicing = ''
      temp.forEach(x => {
        let nameOnly = ''
        for (let i = 0; i < temp.length; i++) {
          let y = temp[i]

          if (x.column && x.column == y.column && x.assetname != y.assetname) {
            nameOnly = x.assetname + '--' + x.column
            break
          } else {
            nameOnly = x.column
          }
        }
        Splicing += nameOnly || x.opeartion || x.coefficient
      })

      setSplicingL(Splicing)
    }
  }, [])




  return <div >{Splicing}</div>;
};

Preview.propTypes = {
  data: PropTypes.string,
};

export default Preview;

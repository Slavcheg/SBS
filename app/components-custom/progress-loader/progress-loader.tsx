import React, { useEffect, useState } from "react"
import ProgressLoader from 'rn-progress-loader';

export function Progress_Loader({flag, color = '#FFFFFF'}) {

    return (
        <ProgressLoader
            visible={flag}
            isModal={false} 
            // isHUD={true}
            // hudColor={"#FFFFFF"}
            color={color} 
        />
    )
}
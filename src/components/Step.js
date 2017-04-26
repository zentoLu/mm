import React from 'react';
const Step = (n) => {
	if(!n) {
		return null
	}
	return  <div className="breadcrumb">
			    <ul className="new-flex-layout">
			        <li className="step step1 new-flex">
			            <div className="on">
			                <div className="point inline-block"></div>
			                <div className="line-right"></div>
			                <div className="step-text tac">录入申贷资料</div>
			            </div>
			        </li>
			        <li className="step step3 new-flex">
			            <div>
			                <div className="line-left"></div>
			                <div className="point inline-block"></div>
			                <div className="line-right"></div>
			                <div className="step-text tac">签约</div>
			            </div>
			        </li>
			        <li className="step step4 new-flex">
			            <div>
			                <div className="line-left"></div>
			                <div className="point inline-block"></div>
			                <div className="step-text tac">审批放款</div>
			            </div>
			        </li>
			    </ul>
			</div>
}

export default Step
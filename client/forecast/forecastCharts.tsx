import React from "react";
import { Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import ForecastChart from "./forecastChart";
import MY_COLORS from "../../common/colors";
import { IForecastDay } from "./forecastData";

type Props = {
  days: Array<IForecastDay>;
  days10r: boolean;
};

const ForecastCharts = observer(({ days, days10r }: Props) => (
  <>
    <Row>
      <Col xs={6}>
        <div className="small text-white-50 font-weight-bold">
          Temperature <span style={{ color: MY_COLORS.orange }}>&#8226;</span>
        </div>
      </Col>
    </Row>
    <Row className="mb-3">
      {days10r === false && <ForecastChart data={days} index={3} />}
      {days10r === true && <ForecastChart data={days} index={10} />}
    </Row>
  </>
));

export default ForecastCharts;

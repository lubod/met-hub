import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import AuthData from "../auth/authData";
import Chart from "./chart";

type MyModalProps = {
  modalShow: boolean;
  handleClose: any;
  name: string;
  unit: string;
  measurement: string;
  couldBeNegative: boolean;
  authData: AuthData;
};

class CData {
  min: number;

  max: number;

  avg: string;

  sum: string;

  domainMin: number;

  domainMax: number;
}

const MyModal = function ({
  modalShow,
  handleClose,
  name,
  unit,
  measurement,
  couldBeNegative,
  authData,
}: // range
MyModalProps) {
  const [hdata, setHdata] = React.useState(null);
  const [cdata, setCdata] = React.useState(new CData());
  const [page, setPage] = React.useState(0);
  const [offset, setOffset] = React.useState(3600 * 1000 * 24);

  async function load(o: number, p: number) {
    // eslint-disable-next-line no-promise-executor-return
    // return new Promise((resolve) => setTimeout(resolve, 2000));
    const start = new Date(Date.now() - o + p * o);
    const end = new Date(Date.now() + p * o);
    const url = `/api/loadData?start=${start.toISOString()}&end=${end.toISOString()}&measurement=${measurement}`;
    console.info(url);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const newData = await response.json();
      let max: number = null;
      let min: number = null;
      let avg: string = null;
      let total: number = null;

      const y = measurement.split(":")[1];
      for (let i = 0; i < newData.length; i += 1) {
        if (i === 0) {
          // console.info(newData[i]);
          const val = parseFloat(newData[i][y]);
          // eslint-disable-next-line no-multi-assign
          max = min = total = val;
        } else {
          const val = parseFloat(newData[i][y]);
          if (val > max) {
            max = val;
          }
          if (val < min) {
            min = val;
          }
          total += val;
        }
      }
      avg = (total / newData.length).toFixed(1);
      const sum = total.toFixed(1);
      let domainMin = Math.floor(min - (max / 100) * 5);
      const domainMax = Math.ceil(max + (max / 100) * 5);

      if (domainMin < 0 && couldBeNegative === false) {
        domainMin = 0;
      }

      setHdata(newData);
      setCdata({ min, max, avg, sum, domainMin, domainMax });
      // console.info(min, max, avg, sum);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (modalShow) {
      load(offset, page);
    }
  }, [modalShow, page, offset]);

  // console.info("render modal");
  return (
    <Modal
      show={modalShow}
      onHide={handleClose}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation={false}
    >
      <Modal.Header
        // closeButton
        style={{
          justifyContent: "center",
        }}
      >
        <Modal.Title
          style={{
            justifyContent: "center",
          }}
        >
          <div>
            {name} {unit}
          </div>
          <div>
            <Button
              variant="outline-secondary"
              onClick={() => setOffset(3600 * 1000 * 1)}
              disabled={offset === 3600 * 1000 * 1}
              size="sm"
            >
              1h
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setOffset(3600 * 1000 * 4)}
              disabled={offset === 3600 * 1000 * 4}
              size="sm"
            >
              4h
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setOffset(3600 * 1000 * 12)}
              disabled={offset === 3600 * 1000 * 12}
              size="sm"
            >
              12h
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setOffset(3600 * 1000 * 24)}
              disabled={offset === 3600 * 1000 * 24}
              size="sm"
            >
              1d
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setOffset(3600 * 1000 * 24 * 3)}
              disabled={offset === 3600 * 1000 * 24 * 3}
              size="sm"
            >
              3d
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setOffset(3600 * 1000 * 24 * 7)}
              disabled={offset === 3600 * 1000 * 24 * 7}
              size="sm"
            >
              1w
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setOffset(3600 * 1000 * 24 * 28)}
              disabled={offset === 3600 * 1000 * 24 * 28}
              size="sm"
            >
              4w
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setPage(page - 1)}
              size="sm"
            >
              &lt;
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setPage(page < 0 ? page + 1 : 0)}
              size="sm"
            >
              &gt;
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setPage(0)}
              size="sm"
            >
              |
            </Button>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          justifyContent: "center",
        }}
      >
        <Chart
          chdata={hdata}
          xkey="timestamp"
          ykey={measurement.split(":")[1]}
          y2key={measurement.split(":")[2]}
          domainMin={cdata.domainMin}
          domainMax={cdata.domainMax}
        />
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        Min:{cdata.min}, Max:{cdata.max}, Avg:{cdata.avg}, Page={page}
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;

import React, { useContext, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { AppContextP } from "..";
import Chart from "./chart";

type MyModalProps = {
  modalShow: boolean;
  handleClose: any;
  name: string;
  unit: string;
  measurement: string;
  couldBeNegative: boolean;
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
}: // range
MyModalProps) {
  const [hdata, setHdata] = React.useState(null);
  const [cdata, setCdata] = React.useState(new CData());
  const [page, setPage] = React.useState(0);
  const [offset, setOffset] = React.useState(3600 * 1000 * 24);
  const appContext = useContext(AppContextP);

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
          Authorization: `Bearer ${appContext.auth.getAccessToken()}`,
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
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {name} {unit}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="primary"
            onClick={() => setOffset(3600 * 1000 * 1)}
            disabled={offset === 3600 * 1000 * 1}
          >
            1h
          </Button>
          <Button
            variant="primary"
            onClick={() => setOffset(3600 * 1000 * 3)}
            disabled={offset === 3600 * 1000 * 3}
          >
            3h
          </Button>
          <Button
            variant="primary"
            onClick={() => setOffset(3600 * 1000 * 6)}
            disabled={offset === 3600 * 1000 * 6}
          >
            6h
          </Button>
          <Button
            variant="primary"
            onClick={() => setOffset(3600 * 1000 * 12)}
            disabled={offset === 3600 * 1000 * 12}
          >
            12h
          </Button>
          <Button
            variant="primary"
            onClick={() => setOffset(3600 * 1000 * 24)}
            disabled={offset === 3600 * 1000 * 24}
          >
            1d
          </Button>
          <Button
            variant="primary"
            onClick={() => setOffset(3600 * 1000 * 24 * 3)}
            disabled={offset === 3600 * 1000 * 24 * 3}
          >
            3d
          </Button>
          <Button
            variant="primary"
            onClick={() => setOffset(3600 * 1000 * 24 * 7)}
            disabled={offset === 3600 * 1000 * 24 * 7}
          >
            7d
          </Button>
          <Button
            variant="primary"
            onClick={() => setOffset(3600 * 1000 * 24 * 28)}
            disabled={offset === 3600 * 1000 * 24 * 28}
          >
            28d
          </Button>
        </div>
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="primary" onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <Button variant="primary" onClick={() => setPage(0)}>
            Now
          </Button>
          <Button
            variant="primary"
            onClick={() => setPage(page < 0 ? page + 1 : 0)}
          >
            Next
          </Button>
        </div>
        Min:{cdata.min}, Max:{cdata.max}, Avg:{cdata.avg}, Page={page}
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;

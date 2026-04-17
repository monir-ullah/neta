import React from "react";
import UserLocation from "./UserLocation";
import { User } from "lucide-react";
import UserLocation2 from "./AccurateLocationLogger";
import AccurateLocationLogger from "./AccurateLocationLogger";
import CameraComponent from "./CameraComponent";
import PythonWebcam from "./PythonWebcam";
import PythonWebcam2 from "./PythonWebCam2";
import LocationPlusCamera from "./LocationPlusCamera";

const features = [
  {
    title: "Smart Tracking",
    img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5",
    size: "large",
  },
  {
    title: "Goal Setting",
    img: "https://images.unsplash.com/photo-1607083206968-13611e3d76db",
  },
  {
    title: "Instant Alerts",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
  },
  {
    title: "Bill Management",
    img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
  },
  {
    title: "Savings Pots",
    img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07",
  },
  {
    title: "Multi-currency",
    img: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c",
  },
];

const FeatureSection: React.FC = () => {
  return (
    <div className="container">
      <h4 className="subtitle">EVERYTHING YOU NEED</h4>
      <h1 className="title">A toolkit built for real life</h1>
      <p className="desc">
        Six powerful features that work together so you always know exactly
        where you stand financially.
      </p>

      <div className="grid">
        {features.map((item, index) => (
          <div
            key={index}
            className={`card ${item.size === "large" ? "large" : ""}`}
            id={`card-${index}`}
            style={{ backgroundImage: `url(${item.img})` }}
          >
            <div className="overlay" />
            <div className="cardText">{item.title}</div>
          </div>
        ))}
      </div>

       <UserLocation />
      <AccurateLocationLogger /> 
      <CameraComponent />
      {/* <PythonWebcam /> */}
      

      {/* <PythonWebcam2 /> */}

      {/* <LocationPlusCamera /> */}
      {/* <button className="cta">Get started — it's free</button> */}

      {/* CSS inside same file */}
      <style>{`
        .container {
          padding: 40px 20px;
          text-align: center;
          font-family: Arial, sans-serif;
        }

        .subtitle {
          color: #2ecc71;
          letter-spacing: 2px;
          font-size: 14px;
        }

        .title {
          font-size: 36px;
          margin: 10px 0;
        }

        .desc {
          color: #666;
          max-width: 600px;
          margin: 0 auto 40px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .card {
          position: relative;
          height: 180px;
          border-radius: 16px;
          background-size: cover;
          background-position: center;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 16px;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }

        .card.large {
          grid-column: span 2;
          grid-row: span 2;
          height: 100%;
          min-height: 380px;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
        }

        .cardText {
          position: relative;
          z-index: 2;
        }

        .cta {
          margin-top: 40px;
          padding: 14px 28px;
          border-radius: 30px;
          border: none;
          background: #0a2540;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }

        .cta:hover {
          background: #163a5f;
        }
          

        div#card-4, div#card-3 {
            margin-top: 30px !important;
        }
            

        /* Responsive */
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .card.large {
            grid-column: span 1;
            grid-row: span 1;
            min-height: 220px;
          }
        }
      `}</style>
    </div>
  );
};

export default FeatureSection;
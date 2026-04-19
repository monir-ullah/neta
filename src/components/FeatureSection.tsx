import React from "react";
import CameraComponent from "./CameraComponent";

// const features = [
//   {
//     title: "Smart Tracking",
//     img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5",
//     size: "large",
//   },
//   {
//     title: "Goal Setting",
//     img: "https://images.unsplash.com/photo-1607083206968-13611e3d76db",
//   },
//   {
//     title: "Instant Alerts",
//     img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
//   },
//   {
//     title: "Bill Management",
//     img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
//   },
//   {
//     title: "Savings Pots",
//     img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07",
//   },
//   {
//     title: "Multi-currency",
//     img: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c",
//   },
// ];

const features = [
  {
    title: "Dr. Shahadat Hossain",
    img: "https://businessinbangladesh.com.bd/wp-content/uploads/2025/10/561730394_1252719946897119_2293132499116009237_n.jpg",
    size: "large", 
  },
  {
    title: "Humam Quader Chowdhury",
    img: "https://assets.deshkalnews.com/media/english/imgAll/2026February/ctg-7-deshkal-news-1770966301-1770966615.jpg",
  },
  {
    title: "Gias Uddin Quader Chowdhury",
    img: "https://asset.news24bd.tv/public/news_images/2025/07/30/1753850595-c8308d429648c3fd28d585b44ffb1920.jpg?w=1920&q=100",
  },
  {
    title: "Sayeed Al Noman",
    img: "https://www.bssnews.net/assets/news_photos/2026/02/13/image-360629-1770973600.jpg",
  },
  {
    title: "Abu Sufian",
    img: "https://www.thedailystar.net/sites/default/files/styles/big_1/public/images/2025/11/03/19201080_frame_-_2025-11-03t211750.040.jpg?h=d1cb525d",
  },
  {
    title: "Ershad Ullah",
    img: "https://www.banglatelegraph.com/wp-content/uploads/2025/11/Ershad-Ullah.png",
  },
];

const FeatureSection: React.FC = () => {
  return (
    <div className="container">
      <h4 className="subtitle">তোর বাপরা বসে আছি—শুধু ওয়েট </h4>
      <h1 className="title">চিনতে পারছোস তোর বাপদের? তোর জন্য পুরো সেটআপ রেডি।</h1>
      <p className="desc">
        চিনতে পারছোস তোর বাপদের? সব দিক থেকে নজর আছে—এখন শুধু তোর একবার সামনে আসা বাকি।
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

       
      <CameraComponent />

      {/* CSS inside same file */}
      <style>{`
        .container {
          padding: 40px 20px;
          text-align: center;
          font-family: Arial, sans-serif;
        }
          .card.large {
            grid-column: span 2;
            grid-row: span 2;
           
          }

        .subtitle {
          color: #eb132d;
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
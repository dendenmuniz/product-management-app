import { Link } from "react-router-dom";




export const Hero = () => {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src="/herot.png" className="max-w-3xl " />
          
          <div>
            <h1 className="text-5xl font-bold">
              Buzz like a Boss. Sell like a Queen Bee.
            </h1>
            <p className="py-6">
              Whether you manage the inventory or drive the sales, QueenBee
              empowers product owners and sellers to collaborate through a
              streamlined Multi-Sales Channel. Maintain control, enable
              visibility, and let your products make all the buzz.
            </p>
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const Container = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full  mx-auto px-4 sm:px-6 lg:px-8 md:max-w-[820px] lg:max-w-[1350px] ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
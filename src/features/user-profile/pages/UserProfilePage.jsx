import BreadCrumb from "../../../components/BreadCrumb";
import Container from "../../../components/Container";
import UserProfileCard from "../components/UserProfileCard";

const UserProfilePage = () => {
  return (
    <section className="min-h-screen bg-surface pb-16">
      <Container>
        <div className="pt-6">
          <BreadCrumb currentPageTitle="My Account" />
        </div>
        <UserProfileCard />
      </Container>
    </section>
  );
};

export default UserProfilePage;
import React, { useEffect, useState } from "react";
import SignIn from "./SignIn";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { ReactComponent as homeIcon } from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";

function Profile() {
  const [changeDetails, setChangeDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const { name, email } = formData;

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update user
        await updateProfile(auth.currentUser, { displayName: name });
        //update db
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingID) => {
    if (window.confirm("Are you sure you want to delete the listing?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Succesfully deleted listing");
    }
  };

  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  return (
    <>
      <div className="profile">
        <header className="profileHeader">
          <p className="pageHeader">My Profile</p>
          <button type="button" onClick={onLogout} className="logOut">
            Log out
          </button>
        </header>
        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>
            <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "done" : "change"}
            </p>
          </div>

          <div className="profileCard">
            <form>
              <input
                type="text"
                id="name"
                className={!changeDetails ? "profileName" : "profileNameActive"}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
              <input
                type="text"
                id="email"
                className={
                  !changeDetails ? "profileEmail" : "profileEmailActive"
                }
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
              />
            </form>
          </div>
          <Link to="/create-listing" className="createListing">
            <img src={homeIcon} alt="homeIcon" />
            <p>Sell or rent your home</p>
            <img src={ArrowRightIcon} alt="arrow right" />
          </Link>

          {!loading && listings.length > 0 && (
            <>
              <p className="listingText">Your Listings</p>

              <ul className="listingsList">
                {listings.map((listing) => (
                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Profile;

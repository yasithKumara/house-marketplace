import React, { useEffect, useState } from "react";
import shareIcon from "../assets/svg/shareIcon.svg";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(db, "listings", params.listingId);
        console.log('first')
        const docSnap = await getDoc(docRef);
        console.log('second')

        if (docSnap.exists()) {
          console.log(docSnap.data());
          setListing(docSnap.data());
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  return <div>Listing</div>;
}

export default Listing;

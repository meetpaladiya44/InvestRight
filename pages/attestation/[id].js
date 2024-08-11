import React, { useEffect, useContext, useState } from "react";
import { useRouter } from 'next/router'
import Attestation from "../../Components/Attestation"

const index = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <Attestation id={id} />
    </>
  );
};

export default index;
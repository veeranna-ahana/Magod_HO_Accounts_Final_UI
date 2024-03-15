import React from 'react';
import TaxMaster from './TaxMaster';

import TaxMasterForm from './TaxMasterForm';

export default function TaxMasterCall() {
  return (
    <div>
      <div>
        <TaxMaster />


        <div className="col-md-12 col-sm-12">
          <TaxMasterForm />


        </div>
      </div>
    </div>
  );
}

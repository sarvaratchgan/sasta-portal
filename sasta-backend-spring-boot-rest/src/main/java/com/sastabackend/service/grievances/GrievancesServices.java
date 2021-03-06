package com.sastabackend.service.grievances;

import com.sastabackend.domain.Grievances;
import com.sastabackend.domain.ReportsProperty;
import com.sastabackend.domain.ResponseModel;

/**
 * Created by SARVA on 27/Dec/2015.
 */
public interface GrievancesServices {
    ResponseModel findOne(Long id);
    ResponseModel findAll(Long userid,Long auditid);
    ResponseModel Add(Grievances gv);
    ResponseModel Update(Grievances gv);
    ResponseModel getGrievancesReports(ReportsProperty prop);
}

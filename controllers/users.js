import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
} from "@coreui/react";

import { connect } from "react-redux";
import { loadUsers } from "src/store/reducers/users";

const getBadge = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "danger";
    case "Pending":
      return "warning";
    default:
      return "primary";
  }
};

const Users = (props) => {
  const { loadUsers, users } = props;
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`);
  };

  useEffect(() => {
    currentPage !== page && setPage(currentPage);
    loadUsers();
  }, [currentPage, page, loadUsers]);

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Patients
            <small className="text-muted"> List</small>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={users}
              fields={[
                { key: "name", _classes: "font-weight-bold" },
                { key: "lastName", _classes: "font-weight-bold" },
                "email",
                "phoneNumber",
                "status",
              ]}
              hover
              striped
              itemsPerPage={5}
              activePage={page}
              clickableRows
              onRowClick={(item) => history.push(`/users/${item._id}/`)}
              scopedSlots={{
                status: (item) => (
                  <td>
                    <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
                  </td>
                ),
              }}
            />
            <CPagination
              activePage={page}
              onActivePageChange={pageChange}
              pages={Math.ceil(users.length / 5)}
              doubleArrows={false}
              align="center"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

const mapStateToProps = (state) => {
  return {
    users: state.users.list,
    loading: state.users.loading,
  };
};

const mapDispatchToProps = {
  loadUsers: () => loadUsers(),
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);

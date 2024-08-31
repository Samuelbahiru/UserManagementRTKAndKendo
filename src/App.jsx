import "./App.css";
import { useEffect, useState } from "react";
import { getUserData, createUser, editUser } from "./features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

// Kendo
import {
  Form,
  Field,
  FormElement,
  FieldWrapper,
} from "@progress/kendo-react-form";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import "@progress/kendo-theme-default/dist/all.css";
import { Input } from "@progress/kendo-react-inputs";
import { Button as KendoButton } from "@progress/kendo-react-buttons";

// Bootstrap
import { Row, Col, Button } from "react-bootstrap";

function App() {
  const dispatch = useDispatch();
  const { userData, isLoading } = useSelector((store) => store.user);

  // Kendo pagination state
  const [dataState, setDataState] = useState({
    take: 10,
    skip: 0,
  });

  // State to manage edit user
  const [editUserState, setEditUserState] = useState(null);

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  // For Kendo pagination
  const handleDataStateChange = (event) => {
    setDataState(event.dataState);
  };

  const handleEditClick = (user) => {
    console.log("Editing user:", user); // Debugging line
    setEditUserState(user);
  };

  const handleSubmit = (dataItem) => {
    if (editUserState) {
      dispatch(editUser(dataItem));
    } else {
      dispatch(createUser(dataItem));
    }
    setEditUserState(null); // Clear the form after submission
  };

  const handleCancelEdit = () => {
    setEditUserState(null); // Close the edit form
  };

  if (isLoading) {
    return <h1>Loading ...</h1>;
  }

  return (
    <>
      {/* Main Form for Adding or Editing User */}
      <Form
        key={editUserState ? editUserState.id : "new"} // Unique key to force re-render
        initialValues={editUserState || {}}
        onSubmit={(dataItem) => handleSubmit(dataItem)}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 650 }}>
            <Row>
              <Col>
                <FieldWrapper>
                  <div className="k-form-field-wrap">
                    <Field
                      name={"id"}
                      component={Input}
                      labelClassName={"k-form-label"}
                      label={"id"}
                    />
                  </div>
                </FieldWrapper>
              </Col>
              <Col>
                <FieldWrapper>
                  <div className="k-form-field-wrap">
                    <Field
                      name={"firstname"}
                      component={Input}
                      labelClassName={"k-form-label"}
                      label={"First name"}
                    />
                  </div>
                </FieldWrapper>
              </Col>
              <Col>
                <FieldWrapper>
                  <div className="k-form-field-wrap">
                    <Field
                      name={"lastname"}
                      component={Input}
                      labelClassName={"k-form-label"}
                      label={"Last name"}
                    />
                  </div>
                </FieldWrapper>
              </Col>
              <Col>
                <FieldWrapper>
                  <div className="k-form-field-wrap">
                    <Field
                      name={"email"}
                      component={Input}
                      labelClassName={"k-form-label"}
                      label={"Email"}
                    />
                  </div>
                </FieldWrapper>
              </Col>
            </Row>

            <div className="k-form-buttons">
              <KendoButton
                type={"submit"}
                className="my-3 btn-primary"
                disabled={!formRenderProps.allowSubmit}
              >
                {editUserState ? "Update" : "Submit"}
              </KendoButton>
              <KendoButton
                type={"button"}
                className="my-3 btn-danger"
                onClick={handleCancelEdit}
              >
                Clear
              </KendoButton>
            </div>
          </FormElement>
        )}
      />

      {/* Data Grid for Displaying Users */}
      <Grid
        data={process(userData, dataState)}
        pageable={true}
        skip={dataState.skip}
        take={dataState.take}
        total={userData.length}
        {...dataState}
        onDataStateChange={handleDataStateChange}
      >
        <Column field="id" title="ID" />
        <Column field="firstname" title="First Name" />
        <Column field="lastname" title="Last Name" />
        <Column field="email" title="Email" />
        <Column
          title="Actions"
          cell={(props) => (
            <td>
              <Button
                className="btn-danger"
                onClick={() => handleEditClick(props.dataItem)}
              >
                Edit
              </Button>
            </td>
          )}
        />
      </Grid>
    </>
  );
}

export default App;

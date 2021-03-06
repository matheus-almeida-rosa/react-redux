import React from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CourseList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import TextInput from "../common/TextInput";

class CoursesPage extends React.Component {
  state = {
    redirectToAddCoursePage: false,
    redirectToAddAuthorPage: false,
    filter: "",
  };

  componentDidMount() {
    const { courses, authors, actions } = this.props;

    if (courses.list.length === 0) {
      actions.loadCourses().catch((error) => {
        alert("Loading courses failed" + error);
      });
    }

    if (authors.length === 0) {
      actions.loadAuthors().catch((error) => {
        alert("Loading authors failed" + error);
      });
    }
  }

  handleDeleteCourse = async (course) => {
    toast.success("Course deleted");
    try {
      await this.props.actions.deleteCourse(course);
    } catch (error) {
      toast.error("Deleted failed." + error.message, { autoClose: false });
    }
  };

  handleOnChange = (event) => {
    const { value } = event.target;
    this.setState({ filter: value.toLowerCase() });
  };

  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        {this.state.redirectToAddAuthorPage && <Redirect to="/author" />}
        <h2>Courses</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20, marginRight: 20 }}
              className="btn btn-primary add-course"
              onClick={() => this.setState({ redirectToAddCoursePage: true })}
            >
              Add Course
            </button>

            <button
              style={{ marginBottom: 20, marginRight: 20 }}
              className="btn btn-primary add-author"
              onClick={() => this.setState({ redirectToAddAuthorPage: true })}
            >
              Add Author
            </button>

            <TextInput
              name="filter"
              label="Filter"
              value={this.state.filter}
              onChange={this.handleOnChange}
            ></TextInput>

            <CourseList
              onDeleteClick={this.handleDeleteCourse}
              courses={this.props.courses}
              filter={this.state.filter}
            ></CourseList>
          </>
        )}
      </>
    );
  }
}

CoursesPage.propTypes = {
  courses: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    courses:
      state.authors.length === 0
        ? { list: [] }
        : {
            list: state.courses.list.map((course) => {
              return {
                ...course,
                authorName: state.authors.find((a) => a.id === course.authorId)
                  .name,
              };
            }),
          },
    authors: state.authors,
    loading: state.apiCallsInProgress > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
      searchCourse: bindActionCreators(courseActions.searchCourses, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);

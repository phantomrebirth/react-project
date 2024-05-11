import React from 'react'
import { Table } from 'react-bootstrap';

const Grades = () => {
  return (
    <div>
        <Table responsive className='mt-2'>
            <thead>
                <tr style={{textAlign: "center"}}>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Classes</th>
                    <th>Absent</th>
                    <th>Quizzes Grades</th>
                    <th>Assignments</th>
                    <th>Projects</th>
                    <th>Total Grades</th>
                </tr>
            </thead>
            <tbody>
                <tr style={{textAlign: "center"}}>
                    <td>1</td>
                    <td>Ahmed</td>
                    <td>8</td>
                    <td>2</td>
                    <td>9</td>
                    <td>0</td>
                    <td>1</td>
                    <td>16</td>
                </tr>
                <tr style={{textAlign: "center"}}>
                    <td>2</td>
                    <td>Yassin</td>
                    <td>8</td>
                    <td>1</td>
                    <td>9</td>
                    <td>5</td>
                    <td>1</td>
                    <td>44</td>
                </tr>
                <tr style={{textAlign: "center"}}>
                    <td>3</td>
                    <td>Harpy</td>
                    <td>9</td>
                    <td>0</td>
                    <td>10</td>
                    <td>4</td>
                    <td>2</td>
                    <td>69</td>
                </tr>
                <tr style={{textAlign: "center"}}>
                    <td>4</td>
                    <td>Harpy</td>
                    <td>9</td>
                    <td>0</td>
                    <td>10</td>
                    <td>4</td>
                    <td>2</td>
                    <td>69</td>
                </tr>
                <tr style={{textAlign: "center"}}>
                    <td>5</td>
                    <td>Harpy</td>
                    <td>9</td>
                    <td>0</td>
                    <td>10</td>
                    <td>4</td>
                    <td>2</td>
                    <td>69</td>
                </tr>
                <tr style={{textAlign: "center"}}>
                    <td>6</td>
                    <td>Harpy</td>
                    <td>9</td>
                    <td>0</td>
                    <td>10</td>
                    <td>4</td>
                    <td>2</td>
                    <td>69</td>
                </tr>
                <tr style={{textAlign: "center"}}>
                    <td>7</td>
                    <td>Harpy</td>
                    <td>9</td>
                    <td>0</td>
                    <td>10</td>
                    <td>4</td>
                    <td>2</td>
                    <td>69</td>
                </tr>
                <tr style={{textAlign: "center"}}>
                    <td>8</td>
                    <td>Harpy</td>
                    <td>9</td>
                    <td>0</td>
                    <td>10</td>
                    <td>4</td>
                    <td>2</td>
                    <td>69</td>
                </tr>
            </tbody>
        </Table>
    </div>
  );
};

export default Grades;